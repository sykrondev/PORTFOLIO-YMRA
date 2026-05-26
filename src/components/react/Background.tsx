import { useTheme } from '../../lib/useTheme';
import { StarsBackground } from './StarsBackground';
import { DayBackground } from './DayBackground';
import { MathBackground } from './MathBackground';

export function Background() {
  const theme = useTheme();
  if (theme === 'light') {
    return (
      <>
        <DayBackground key="day" />
        <MathBackground key="math-light" variant="light" />
      </>
    );
  }
  return (
    <>
      <StarsBackground key="night" />
      <MathBackground key="math-dark" variant="dark" />
    </>
  );
}
