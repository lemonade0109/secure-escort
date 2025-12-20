import React from "react";
import CardActionButton from "./card-action-button";
import { ArrowRight } from "lucide-react";
import CinematicCardV2 from "./cinematic-card-v2";

type ServiceCardProps = {
  icon: string;
  spanText: string;
  title: string;
  description: string;
  linkHref: string;
  btnText?: string | "Learn More";
};

const ServiceCard = ({
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

      <CardActionButton
        href={linkHref}
        className="text-white flex justify-end items-center hover:bg-none hover:text-white/80 "
      >
        <div className="flex items-center gap-2">
          {btnText}
          <ArrowRight className="size-4" />
        </div>
      </CardActionButton>
    </CinematicCardV2>
  );
};

export default ServiceCard;
