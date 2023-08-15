import { cn } from '@/lib/cn';
import styles from './fallback.module.css';

export const LoadingFallback = () => {
  return (
    <div
      className={cn('grid h-full w-full place-items-center text-foreground')}
    >
      {/* <span className="icon-[svg-spinners--ring-resize] aspect-square text-5xl" />
      <span className="icon-[svg-spinners--ring-resize] aspect-square text-5xl" /> */}
      <div className={styles.loader}>
        Loading
        <span></span>
      </div>
    </div>
  );
};
