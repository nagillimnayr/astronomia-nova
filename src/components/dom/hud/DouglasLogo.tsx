import Image from 'next/image';

const DouglasLogo = () => {
  return (
    <div className="relative hidden w-[122px] select-none md:block">
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
