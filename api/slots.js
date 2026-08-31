const GAS_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbxuIEi5Va0HT3GHxQBf7JszFJ3b7qqZAF03aZbebNJKTIvb9JhU6upX4djesD-CZORDdQ/exec";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    const response = await fetch(`${GAS_WEBAPP_URL}?action=slots`, {
      method: "GET",
      redirect: "follow",
      headers: { Accept: "application/json" }
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      return res.status(502).json({
        success: false,
        message:
          "空き枠取得先から正常なデータが返りませんでした。GASの公開URL・アクセス権限を確認してください。"
      });
    }

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "GASとの通信に失敗しました。"
      });
    }

    return res.status(200).json(result);
  } catch {
    return res.status(502).json({
      success: false,
      message: "空き枠の取得に失敗しました。時間をおいて再度お試しください。"
    });
  }
}
