import { Hud } from '~/drei-imports/portals/Hud';
import TimePanel from '../Time/TimePanel';
import { ScreenSpace } from '~/drei-imports/abstractions/ScreenSpace';
import { Center } from '~/drei-imports/staging/Center';
import { ScreenQuad } from '~/drei-imports/shapes/ScreenQuad';
import { BBAnchor } from '~/drei-imports/staging/BBAnchor';

export const HUD = () => {
  return (
    <>
      <Hud>
        <ScreenSpace depth={1}>
          <BBAnchor anchor={[0, 0, 0]}>
            <object3D position={[0, 0, 0]}>
              <TimePanel />
            </object3D>
          </BBAnchor>
        </ScreenSpace>
      </Hud>
    </>
  );
};
