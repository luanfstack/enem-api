import {
  Provider,
  Root,
  Title,
  Description,
  Viewport,
} from "@radix-ui/react-toast";

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}

const Toast = ({ open, onOpenChange, title, description }: ToastProps) => {
  return (
    <Provider swipeDirection="up">
      <Root
        className="fixed top-4 right-4 w-full max-w-xs p-4 rounded-md shadow-lg bg-white border border-gray-200 flex flex-col gap-1 z-50"
        open={open}
        onOpenChange={onOpenChange}
      >
        <Title className="font-semibold text-red-600">{title}</Title>
        <Description asChild>
          <span className="text-sm text-gray-700">{description}</span>
        </Description>
      </Root>
      <Viewport className="fixed top-4 right-4 w-full max-w-xs z-50" />
    </Provider>
  );
};

export { Toast };
