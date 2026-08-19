export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/consult" && request.method === "POST") {
      return handleConsult(request, env);
    }

    // everything else — serve the static site files as before
    return env.ASSETS.fetch(request);
  }
};

async function handleConsult(request, env) {
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json; charset=utf-8" }
    });

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "bad_json" }, 400);
  }

  const name = String(data.name || "").trim().slice(0, 200);
  const phone = String(data.phone || "").trim().slice(0, 60);
  const email = String(data.email || "").trim().slice(0, 200);
  const comment = String(data.comment || "").trim().slice(0, 1000);

  if (!name || !phone || !email) {
    return json({ ok: false, error: "missing_fields" }, 400);
  }

  const text =
    `🟡 Нова заявка з сайту Lumen Edu\n\n` +
    `Ім'я: ${name}\n` +
    `Телефон: ${phone}\n` +
    `Email: ${email}\n` +
    (comment ? `Коментар: ${comment}` : "");

  const tgRes = await fetch(
    `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: env.MANAGER_CHAT_ID,
        text
      })
    }
  );

  if (!tgRes.ok) {
    return json({ ok: false, error: "telegram_failed" }, 502);
  }

  return json({ ok: true });
}
