export interface MetarResponse {
  meta: {
    timestamp: string;
  };
  altimeter: {
    repr: string;
    value: number;
    spoken: string;
  };
  clouds: Array<{
    repr: string;
    type: string;
    altitude: number;
    modifier: string | null;
    direction: string | null;
  }>;
  flight_rules: "VFR" | "MVFR" | "IFR" | "LIFR";
  raw: string;
  sanitized: string;
  station: string;
  time: {
    repr: string;
    dt: string;
  };
  visibility: {
    repr: string;
    value: number;
    spoken: string;
  };
  wind_direction: {
    repr: string;
    value: number;
    spoken: string;
  };
  wind_speed: {
    repr: string;
    value: number;
    spoken: string;
  };
  wind_gust: {
    repr: string;
    value: number | null;
    spoken: string;
  } | null;
  temperature: {
    repr: string;
    value: number;
    spoken: string;
  };
  dewpoint: {
    repr: string;
    value: number;
    spoken: string;
  };
  relative_humidity: number;
  units: {
    altimeter: string;
    altitude: string;
    temperature: string;
    visibility: string;
    wind_speed: string;
  };
}
