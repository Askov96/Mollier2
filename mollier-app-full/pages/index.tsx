import { useState } from "react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip } from "recharts";

const generateMollierData = () => {
  const data = [];
  for (let temp = -10; temp <= 50; temp += 5) {
    for (let rh = 10; rh <= 100; rh += 10) {
      const pws = 6.112 * Math.exp((17.67 * temp) / (temp + 243.5));
      const pw = (rh / 100) * pws;
      const humidityRatio = 0.622 * pw / (1013.25 - pw);
      data.push({
        temperature: temp,
        humidityRatio: parseFloat(humidityRatio.toFixed(4)),
        relativeHumidity: rh,
      });
    }
  }
  return data;
};

const mollierData = generateMollierData();

export default function Home() {
  const [airflow, setAirflow] = useState(1000);
  const [deltaT, setDeltaT] = useState(10);
  const [deltaX, setDeltaX] = useState(0.005);

  const calculateCoolingHeatingPower = (airflow: number, deltaT: number, deltaX: number) => {
    const airDensity = 1.2;
    const specificHeatAir = 1.005;
    const latentHeat = 2500;
    const volumeFlow = airflow / 3600;
    const massFlow = airDensity * volumeFlow;
    const sensible = massFlow * specificHeatAir * deltaT;
    const latent = massFlow * latentHeat * deltaX;
    return { sensible: sensible.toFixed(2), latent: latent.toFixed(2) };
  };

  const { sensible, latent } = calculateCoolingHeatingPower(airflow, deltaT, deltaX);

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Mollier Diagram</h1>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <XAxis type="number" dataKey="temperature" name="Temperature (°C)" />
            <YAxis type="number" dataKey="humidityRatio" name="Humidity Ratio (kg/kg)" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Mollier" data={mollierData} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div>
        <p><strong>Airflow:</strong> {airflow} m³/h</p>
        <p><strong>ΔT:</strong> {deltaT} °C</p>
        <p><strong>ΔX:</strong> {deltaX} kg/kg</p>
        <p className="text-green-600"><strong>Sensible:</strong> {sensible} kW</p>
        <p className="text-blue-600"><strong>Latent:</strong> {latent} kW</p>
      </div>
    </main>
  );
}
