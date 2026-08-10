import type { LucideIcon } from "lucide-react";
import { Clock, CheckCircle2, XCircle, Truck, Package } from "lucide-react";

export type StatusKey = "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado";

export type OrderStatusConfig = {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: LucideIcon;
};

export const STATUS_CONFIG: Record<StatusKey, OrderStatusConfig> = {
  pendiente:   { label: "Pendiente",   color: "#c8ff00", bg: "rgba(200,255,0,0.06)",   border: "rgba(200,255,0,0.25)",   icon: Clock        },
  procesando:  { label: "Procesando",  color: "#a855f7", bg: "rgba(168,85,247,0.06)",  border: "rgba(168,85,247,0.25)",  icon: Package      },
  enviado:     { label: "Enviado",     color: "#00e5ff", bg: "rgba(0,229,255,0.06)",   border: "rgba(0,229,255,0.25)",   icon: Truck        },
  entregado:   { label: "Entregado",   color: "#c8ff00", bg: "rgba(200,255,0,0.06)",   border: "rgba(200,255,0,0.25)",   icon: CheckCircle2 },
  cancelado:   { label: "Cancelado",   color: "#ef4444", bg: "rgba(239,68,68,0.06)",   border: "rgba(239,68,68,0.25)",   icon: XCircle      },
};

export const getStatus = (s?: string): OrderStatusConfig =>
  (s ? STATUS_CONFIG[s as StatusKey] : undefined) ?? {
    label: s ?? "Desconocido",
    color: "#52525b",
    bg: "rgba(82,82,91,0.06)",
    border: "rgba(82,82,91,0.2)",
    icon: Clock,
  };
