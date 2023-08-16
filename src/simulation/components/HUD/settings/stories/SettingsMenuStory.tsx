import { SettingsMenu } from '../SettingsMenu';

export const SettingsMenuStory = () => {
  return (
    <>
      <div className="w-50 relative top-0 col-end-[-1] row-start-1 aspect-square ">
        <SettingsMenu defaultOpen />
      </div>
    </>
  );
};
