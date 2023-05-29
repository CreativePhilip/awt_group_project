import { IconDefinition, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";

type IconButtonProps = {
    onClick?: () => void;
    icon: IconDefinition;
    isDisabled?: boolean;
    size?: SizeProp;
};


export function IconButton({
    onClick,
    icon,
    isDisabled,
    size = "lg",
}: IconButtonProps) {
return (
    <button onClick={onClick} type="button" disabled={isDisabled}>
    <Fa
        icon={icon}
        size={size}
        className="text-neutral-700"
    />
    </button>
);
}
