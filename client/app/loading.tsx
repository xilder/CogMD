import { Spinner } from '@/components/ui/spinner';

const Loading = () => {
  return (
    <div className='h-full w-full flex items-center justify-center border'>
      <Spinner />
    </div>
  );
};

export default Loading;
