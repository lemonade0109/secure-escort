import React from "react";
import CardActionButton from "./card-action-button";
import { ArrowRight } from "lucide-react";
import CinematicCardV2 from "./cinematic-card-v2";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ServiceCardProps } from "@/types";

const ServiceCard = ({
  serviceCard,
  icon,
  spanText,
  title,
  description,
  linkHref,
  btnText = "Learn More",
}: ServiceCardProps) => {
  return (
    <CinematicCardV2 className="transition-transform duration-300 hover:translate-y-1">
      <div className="mb-4 inline-flex items-center justify-center gap-2">
        <span className="mb-4 text-gold text-3xl">{icon}</span>
        <span className="text-xs uppercase tracking-widest text-white/60">
          {spanText}
        </span>
      </div>

      <h3 className="text-lg font-medium ">{title}</h3>
      <p className="mt-2 text-sm text-white/70">{description}</p>

      {serviceCard === true ? (
        <CardActionButton
          href={linkHref}
          className="text-white flex justify-end items-center hover:bg-none hover:text-gold"
        >
          <div className="flex items-center gap-2">
            {btnText}
            <ArrowRight className="size-4" />
          </div>
        </CardActionButton>
      ) : (
        <>
          <div className="h-px w-full bg-linear-to-r from-transparent via-white/15 to-transparent my-6" />
          <Button
            asChild
            className="w-full bg-gold text-black hover:bg-gold/90 "
          >
            <Link href={linkHref}>Select</Link>
          </Button>
        </>
      )}
    </CinematicCardV2>
  );
};

export default ServiceCard;
