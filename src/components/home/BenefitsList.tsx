
import { Check } from "lucide-react";

interface BenefitsListProps {
  benefits: string[];
}

const BenefitsList: React.FC<BenefitsListProps> = ({ benefits }) => {
  return (
    <ul className="space-y-3 mb-8">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center">
          <div className="bg-accent rounded-full p-1 mr-3">
            <Check className="h-4 w-4 text-primary" />
          </div>
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
};

export default BenefitsList;
