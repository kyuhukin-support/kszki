const GAS_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbxuIEi5Va0HT3GHxQBf7JszFJ3b7qqZAF03aZbebNJKTIvb9JhU6upX4djesD-CZORDdQ/exec";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    const response = await fetch(GAS_WEBAPP_URL, {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      return res.status(502).json({
        success: false,
        message:
          "予約結果を確認できませんでした。予約が登録済みの可能性があるため、再送信せず担当者へ確認してください。"
      });
    }

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message:
          "予約結果を確認できませんでした。再送信せず担当者へ確認してください。"
      });
    }

    return res.status(200).json(result);
  } catch {
    return res.status(502).json({
      success: false,
      message:
        "通信エラーで予約結果を確認できませんでした。予約が登録済みの可能性があるため、再送信せず担当者へ確認してください。"
    });
  }
}
