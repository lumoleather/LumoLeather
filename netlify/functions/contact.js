
export default async (req) => {
  // Netlify uses "req" with { method, headers, body } in the newer runtime.
  // If your site uses the older runtime, I can adapt it—this version works for most modern Netlify setups.

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new Response(JSON.stringify({ error: "Expected JSON" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const { name, email, message, website } = await req.json();

    // Simple anti-spam honeypot: real users won't fill "website"
    if (website) {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.TO_EMAIL;
    const FROM_EMAIL = process.env.FROM_EMAIL; // e.g. "Lumo Leather <contact@yourdomain.com>"

    if (!RESEND_API_KEY || !TO_EMAIL || !FROM_EMAIL) {
      return new Response(JSON.stringify({ error: "Server not configured" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    const subject = `New website inquiry from ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`;

    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject,
        text,
        reply_to: email,
      }),
    });

    if (!resendResp.ok) {
      const errText = await resendResp.text();
      return new Response(JSON.stringify({ error: "Email send failed", details: errText }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};
