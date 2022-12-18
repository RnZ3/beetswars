import { useEffect } from "react";
import { useGlobalContext } from "contexts/GlobalContext";
import { ChartData } from "types/ChartData";

const useChartData = async () => {
  const dataUrl = "https://beetswars-backend.cyclic.app/api/v1/chartdata";
  const { gChartData, setGChartData } = useGlobalContext();
  async function fetchData() {
    console.log("fetch");
    const res = await fetch(dataUrl);
    const json = (await res.json()) as ChartData;
    setGChartData(json);
  }
  useEffect(() => {
    if (!gChartData) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useChartData;
