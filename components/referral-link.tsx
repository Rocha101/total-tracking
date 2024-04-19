"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth";
import { useState } from "react";
import { TbCopy, TbLoader2 } from "react-icons/tb";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

const ReferralLink = () => {
  const { account } = useAuth();
  const [copiedText, copy] = useCopyToClipboard();
  const [loadingCopy, setLoadingCopy] = useState(false);

  const handleCopy = (text: string) => () => {
    setLoadingCopy(true);
    copy(text)
      .then(() => {
        toast("Link copiado com sucesso!");
      })
      .catch((error) => {
        console.error("Failed to copy!", error);
        toast("Erro ao copiar link!");
      })
      .finally(() => {
        setLoadingCopy(false);
      });
  };

  const referralLink = `iron-atlas.app/sign-up?referral=${account?.account?.id}`;
  return (
    <div className="w-full md:max-w-[455px] flex items-center justify-between">
      <Input
        disabled
        className="border border-primary disabled:opacity-100 rounded-tr-none rounded-br-none truncate"
        value={referralLink}
      />
      <Button
        size="icon"
        onClick={handleCopy(referralLink)}
        className="rounded-tl-none rounded-bl-none"
      >
        {loadingCopy ? (
          <TbLoader2 className="h-3 w-3 animate-spin" />
        ) : (
          <TbCopy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};

export default ReferralLink;
