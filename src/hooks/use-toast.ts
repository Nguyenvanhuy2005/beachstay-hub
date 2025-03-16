
import { toast as sonnerToast } from "sonner";
import {
  type ToastProps,
  type ToastActionElement,
} from "@/components/ui/toast";

type ToastOptions = ToastProps & {
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type State = {
  toasts: ToastOptions[];
};

let memoryState: State = { toasts: [] };

function dispatch(action: any) {
  memoryState = reducer(memoryState, action);
}

const reducer = (state: State, action: any): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { id } = action;

      // If no id, dismiss all
      if (id === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      // Find the toast
      const toast = state.toasts.find((t) => t.id === id);

      if (!toast) {
        return state;
      }

      if (Array.isArray(toast.onDismiss)) {
        toast.onDismiss.forEach((fn) => fn());
      } else if (typeof toast.onDismiss === "function") {
        toast.onDismiss();
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== id),
      };
    }

    default:
      return state;
  }
};

export function toast({ ...props }: ToastOptions) {
  const id = genId();

  const update = (props: ToastOptions) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: "DISMISS_TOAST", id });

  // Show toast with Sonner for seamless integration
  if (props.variant === "destructive") {
    sonnerToast.error(props.title, {
      id,
      description: props.description,
    });
  } else {
    sonnerToast(props.title, {
      id,
      description: props.description,
    });
  }

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      dismiss,
      update,
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

toast.dismiss = (id?: string) => {
  dispatch({ type: "DISMISS_TOAST", id });
};

export function useToast() {
  return {
    toast,
    toasts: memoryState.toasts,
    dismiss: toast.dismiss,
  };
}
