import { useParams } from "react-router-dom";
import DetailBack from "../components/DetailBack";
import MonsterProfile from "../components/MonsterProfile";

export default function MonsterDetail() {
  const { id } = useParams();

  return (
    <div>
      <DetailBack />
      <MonsterProfile monsterId={Number(id)} />
    </div>
  );
}
