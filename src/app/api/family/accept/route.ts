import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/family/accept
 *
 * Proxies the bloomagain-korea backend's POST /api/v1/family/accept.
 * Body: { invite_code: string, child_phone_hash: string }
 *
 * SECURITY NOTE: child_phone_hash MUST come from a trusted server-side NICE
 * verification handshake — this endpoint trusts whatever is in the body and
 * forwards it. The full NICE flow (web PASS) lives at /api/nice/* (TODO).
 * Until that's wired, this endpoint is gated by the same tenant API key the
 * backend already uses, so casual probes don't succeed.
 */
export async function POST(request: NextRequest) {
  const backendUrl = process.env.BLOOMAGAIN_BACKEND_URL;
  const appId      = process.env.BACKEND_APP_ID;
  const apiKey     = process.env.BACKEND_API_KEY;

  if (!backendUrl) {
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 500 },
    );
  }

  let payload: {
    invite_code?: string;
    child_phone_hash?: string;
    child_fcm_token?: string | null;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const code = (payload.invite_code ?? "").trim().toUpperCase();
  const hash = (payload.child_phone_hash ?? "").trim();
  // FCM token is optional — null when the child denied notification
  // permission or the browser doesn't support FCM. Empty string normalised
  // to undefined so the backend doesn't store an empty token.
  const fcmToken =
    typeof payload.child_fcm_token === "string" && payload.child_fcm_token.length > 0
      ? payload.child_fcm_token
      : undefined;

  if (code.length < 4 || code.length > 16) {
    return NextResponse.json(
      { error: "초대 코드 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }
  if (hash.length !== 64) {
    return NextResponse.json(
      { error: "본인인증이 완료되지 않았습니다." },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(
      `${backendUrl.replace(/\/$/, "")}/api/v1/family/accept`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(appId  ? { "X-App-ID":  appId  } : {}),
          ...(apiKey ? { "X-API-Key": apiKey } : {}),
        },
        body: JSON.stringify({
          invite_code: code,
          child_phone_hash: hash,
          // Forward FCM token only when present — backend treats missing as
          // "child wants SMS / declined push" and the family_link row is
          // still ACTIVE without one.
          ...(fcmToken ? { child_fcm_token: fcmToken } : {}),
        }),
      },
    );

    const raw = await upstream.text();
    if (!upstream.ok) {
      let detail = "초대 처리에 실패했습니다.";
      try {
        const parsed = JSON.parse(raw) as { detail?: string };
        if (parsed.detail) detail = parsed.detail;
      } catch { /* not JSON */ }
      return NextResponse.json({ error: detail }, { status: upstream.status });
    }
    return NextResponse.json(JSON.parse(raw));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
