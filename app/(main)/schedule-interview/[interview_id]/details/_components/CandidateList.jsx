// import React from 'react'

// const CandidateList = ({ candidateList }) => {

//   return (
//     <div className=''>
//       <h2 className='font-bold my-5'>Candidates ({candidateList?.length})</h2>
//         {candidateList.map((candidate, index) => (
//             <div key={index} className='p-5'>
//                 <h2>{candidate?.userName[0]}</h2>
//             </div>
//         ))}
//     </div>
//   )
// }

// export default CandidateList

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import React from 'react';
import { MdReport } from 'react-icons/md';

const CandidateList = ({ candidateList }) => {

  return (
    <div className=''>
      <div>
        <h2 className='font-bold my-5'>Candidate</h2>
        <div className='p-5 flex gap-3 items-center justify-between bg-white rounded-lg'>
          <div className='flex gap-5 items-center'>
            <h2 className='bg-primary p-3 px-4.5 font-bold text-white rounded-full'>{candidateList?.userName[0]}</h2>
            <div>
              <h2 className='font-bold'>{candidateList?.userName}</h2>
              <h2 className='text-sm text-gray-500'>Completed On: {moment(candidateList?.created_at).format('MMM DD, YYYY')}</h2>
            </div>
          </div>
          <div className='flex gap-3 items-center'>
            <Badge variant={'outline'} className='text-green-600 font-medium'>Completed</Badge>
            <Button variant={'outline'} className='text-primary'><MdReport />View Feedback</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
