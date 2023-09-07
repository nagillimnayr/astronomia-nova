import Image from 'next/image';

const DouglasLogo = () => {
  return (
    <div className="relative  w-[122px] select-none">
      <Image
        src={'/logo/Version3_reverse.png'}
        alt=""
        width={1222}
        height={643}
      />
    </div>
  );
};

export default DouglasLogo;
