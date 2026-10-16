import type { SVGProps } from 'react';

export interface IllustrationProps extends SVGProps<SVGSVGElement> {
  /** Movimento em loop (curto, com descanso). Desligado sozinho com “reduzir movimento”. */
  animated?: boolean;
}
