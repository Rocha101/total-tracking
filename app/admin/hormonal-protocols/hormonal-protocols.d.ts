import Hormone from "../hormones/hormones";

interface HormonalProtocol {
  id: string;
  name: string;
  description?: string | null;
  hormones: Hormone[];
  createdAt: Date;
  updatedAt: Date;
  protocol?: Protocol | null;
  protocolId?: string | null;
  account?: Account | null;
  accountId?: string | null;
}

export { HormonalProtocol };
