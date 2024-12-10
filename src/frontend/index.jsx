import React, { useEffect, useState } from "react";
import ForgeReconciler, {
  Button,
  ButtonGroup,
  Inline,
  Spinner,
  Text,
} from "@forge/react";
import { invoke } from "@forge/bridge";

const AVAILABLE_COUNTRIES = [
  { lang: "ja", country: "日本語", code: "JP" },
  { lang: "ko", country: "한국어", code: "KR" },
  { lang: "th", country: "ประเทศไทย", code: "TH" },
  { lang: "ru", country: "россия", code: "RU" },
  { lang: "my", country: "မြန်မာ", code: "MM" },
];

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    const response = await invoke("getText", { targetLanguage: "en" });
    setData(null);
    setLoading(false);
  };

  const translate = async (lang) => {
    setLoading(true);
    await invoke("getText", { targetLanguage: lang }).then(setData);
    setLoading(false);
  };
  return (
    <>
      <ButtonGroup>
        {AVAILABLE_COUNTRIES.map((opt) => (
          <Button onClick={() => translate(opt.lang)}>{opt.country}</Button>
        ))}
      </ButtonGroup>
      <Inline>
        <Button onClick={refresh}>
          <Text>Refresh</Text>
        </Button>
      </Inline>
      {loading ? (
        <Spinner label="loading" size={"small"} />
      ) : (
        <>
          <Text>{data && "Translated Description"}</Text>
          <Text>{data}</Text>
        </>
      )}
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
