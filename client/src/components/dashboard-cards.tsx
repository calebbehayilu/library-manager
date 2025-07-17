import {
  BookOpen,
  UsersIcon,
  ArrowLeftRightIcon,
  TriangleAlert,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardDataType {
  title: string;
  icon: ComponentType<LucideProps>;
  amount: number;
  description?: string;
  color?: string;
}
const CardData: CardDataType[] = [
  {
    title: "Total Books ",
    icon: BookOpen,
    amount: 1250,
    description: "All books in system",
  },
  {
    title: "Total Members",
    icon: UsersIcon,
    amount: 350,
  },
  {
    title: "Active Borrows",
    icon: ArrowLeftRightIcon,
    amount: 89,
  },
  {
    title: "Overdue Books",
    icon: TriangleAlert,
    amount: 1250,
    color: "red",
  },
];
const DashboardCards = () => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {CardData.map((card, index) => (
        <Card className="@container/card">
          <CardHeader key={index}>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.amount}
            </CardTitle>
            <CardAction>
              <card.icon fill={card.color} />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {card.description && (
              <div className="text-muted-foreground">{card.description}</div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DashboardCards;
