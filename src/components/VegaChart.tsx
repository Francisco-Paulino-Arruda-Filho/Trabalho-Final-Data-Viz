
import { VegaEmbed } from "react-vega";

interface Props {
  spec: any;
}

export default function VegaChart({ spec }: Props) {
  return (
    <VegaEmbed
      spec={spec}
      options={{
        actions: false,
        renderer: "svg",
        mode: "vega-lite"
      }}
    />
  );
}
