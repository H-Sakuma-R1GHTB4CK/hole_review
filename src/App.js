// App.js
import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./App.css";
import heartImage from "./assets/heart-removebg-preview.png"; // 画像をインポート

function App() {
  const [ratings, setRatings] = useState({
    material: 5,
    tightness: 5,
    shapeOrientation: 5,
    shapeComplexity: 5,
    depth: 5,
    stimulation: 5,
  });

  const [csvOutput, setCsvOutput] = useState(""); // CSV出力の状態
  const [productName, setProductName] = useState(""); // 商品名の状態
  const [includeHeader, setIncludeHeader] = useState(false); // ヘッダーを含めるかどうかの状態
  const [remarks, setRemarks] = useState(""); // 備考の状態
  const [csvInput, setCsvInput] = useState(""); // CSV入力用の状態
  const [parsedData, setParsedData] = useState([]); // パースされたCSVデータ
  const [ignoreHeader, setIgnoreHeader] = useState(false); // ヘッダーを無視するかどうかの状態を追加

  const handleSliderChange = (key) => (value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [key]: value,
    }));
  };

  const commonWidth = "60%"; // または "300px" などの固定値

  // 各スライダーの左と右のラベル
  const sliderLabels = {
    material: { min: "ソフト", max: "ハード" },
    tightness: { min: "緩い", max: "きつい" },
    shapeOrientation: { min: "人工的", max: "リアル" },
    shapeComplexity: { min: "シンプル", max: "複雑" },
    depth: { min: "短い", max: "長い" },
    stimulation: { min: "まったり", max: "強い刺激" },
  };

  // 日本語の項目名
  const itemLabels = {
    material: "材質",
    tightness: "締め付け",
    shapeOrientation: "形状志向",
    shapeComplexity: "形状複雑さ",
    depth: "奥行き",
    stimulation: "刺激の特性",
  };

  // CSVデータを生成する関数
  const generateCSV = () => {
    const ratingValues = Object.keys(ratings)
      .map((key) => ratings[key])
      .join(",");
    const header = includeHeader
      ? "商品名," + Object.values(itemLabels).join(",") + ",備考\n"
      : "";
    return header + `${productName},${ratingValues},${remarks}`; // 商品名、評価値、備考を結合
  };

  // CSV入力をパースする関数
  const parseCSV = () => {
    let rows = csvInput.split("\n").filter((row) => row.trim() !== "");
    if (ignoreHeader && rows.length > 0) {
      rows = rows.slice(1); // ヘッダーを無視する場合、最初の行をスキップ
    }
    const data = rows.map((row) => {
      const values = row.split(",");
      const productName = values.shift(); // 最初の値を商品名として取得
      const remarks = values.pop(); // 最後の値を備考として取得
      return [productName, ...values, remarks]; // 商品名、評価値、備考の順に配列を構成
    });
    setParsedData(data);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>商品評価入力</h2>

      {/* 商品名入力ボックス */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          商品名:
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px", width: "300px" }}
            placeholder="商品名を入力してください"
          />
        </label>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {Object.keys(ratings).map((key) => (
          <div key={key} style={{ display: "flex", alignItems: "center" }}>
            <label
              style={{
                minWidth: "150px",
                textAlign: "right",
                marginRight: "10px",
              }}
            >
              {itemLabels[key]}：{ratings[key]}
            </label>
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <span
                style={{
                  width: "100px",
                  textAlign: "right",
                  marginRight: "10px",
                }}
              >
                {sliderLabels[key].min}
              </span>
              <Slider
                min={1}
                max={10}
                value={ratings[key]}
                onChange={handleSliderChange(key)}
                step={1}
                included={false}
                railStyle={{ backgroundColor: "#ddd" }}
                trackStyle={{ backgroundColor: "#4CAF50" }}
                style={{ width: commonWidth }}
              />
              <span
                style={{
                  width: "100px",
                  textAlign: "left",
                  marginLeft: "10px",
                }}
              >
                {sliderLabels[key].max}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 備考入力ボックス */}
      <div style={{ marginTop: "20px" }}>
        <label>
          備考:
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px", width: "100%" }}
            placeholder="備考を入力してください"
          />
        </label>
      </div>

      {/* ヘッダーを含めるチェックボックス */}
      <div style={{ marginTop: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={includeHeader}
            onChange={(e) => setIncludeHeader(e.target.checked)}
          />
          ヘッダーを含める
        </label>
      </div>

      {/* CSV出力ボタンとテキストエリア */}
      <button
        onClick={() => {
          const csvData = generateCSV();
          setCsvOutput(csvData);
        }}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        出力
      </button>
      <textarea
        value={csvOutput}
        readOnly
        rows={5}
        style={{ width: "100%", marginTop: "10px" }}
      />

      {/* CSV入力ボックス */}
      <h2>商品評価のCSVを入力</h2>
      <textarea
        value={csvInput}
        onChange={(e) => setCsvInput(e.target.value)}
        rows={5}
        placeholder="CSV形式で商品評価を入力してください"
        style={{ width: "100%", marginTop: "10px" }}
      />

      {/* ヘッダーを無視するチェックボックスを追加 */}
      <div style={{ marginTop: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={ignoreHeader}
            onChange={(e) => setIgnoreHeader(e.target.checked)}
          />
          ヘッダーを無視する
        </label>
      </div>

      <button
        onClick={parseCSV}
        style={{ marginTop: "10px", padding: "10px 20px" }}
      >
        表示
      </button>

      {/* パース結果の表示 */}
      <div style={{ marginTop: "20px" }}>
        {parsedData.map((row, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <strong>{row[0]}</strong>
            <div
              style={{
                marginLeft: "20px",
                backgroundColor: "#f9f9f9",
                borderLeft: "4px solid #ccc",
                paddingLeft: "10px",
              }}
            >
              備考: {row[row.length - 1]}
            </div>
            {row.slice(1, -1).map((value, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                {/* 評価ラベルと数値 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "200px",
                    justifyContent: "flex-end",
                    marginRight: "10px",
                  }}
                >
                  <label
                    style={{
                      textAlign: "right",
                    }}
                  >
                    {Object.values(itemLabels)[i]}:
                  </label>
                  {/* <span style={{ marginLeft: "5px" }}>{value}</span> */}
                </div>
                {/* バーとラベルを含むコンテナ */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "80%",
                  }}
                >
                  {/* 左側のラベル */}
                  <span
                    style={{
                      width: "100px",
                      textAlign: "right",
                      marginRight: "10px",
                    }}
                  >
                    {sliderLabels[Object.keys(ratings)[i]].min}
                  </span>

                  {/* バー */}
                  <div
                    style={{
                      flexGrow: 1,
                      backgroundColor: "#ddd",
                      height: "8px",
                      position: "relative",
                    }}
                  >
                    {/* マーカー */}
                    <div
                      style={{
                        position: "absolute",
                        left: `${(value / 10) * 100}%`,
                        top: "-10px", // マーカーの位置を調整
                        transform: "translateX(-50%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {/* 画像を表示 */}
                      <img
                        src={heartImage}
                        alt="マーカー"
                        style={{
                          width: "24px",
                          height: "24px",
                          marginBottom: "-18px",
                        }}
                      />
                      {/* 数値を表示 */}
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "bold",
                          color: "#ffffff",
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  </div>

                  {/* 右側のラベル */}
                  <span
                    style={{
                      width: "100px",
                      textAlign: "left",
                      marginLeft: "10px",
                    }}
                  >
                    {sliderLabels[Object.keys(ratings)[i]].max}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
