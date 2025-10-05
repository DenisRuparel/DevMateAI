import React from 'react'

const QuestionListContainer = ({ questionList }) => {
    return (
        <div>
            <h2 className='font-bold text-lg mb-5 text-foreground'>Generated Interview Questions</h2>
            <div className='p-5 border border-border rounded-xl bg-card'>
                {questionList.map((item, index) => (
                    <div key={index} className='p-3 border border-border rounded-xl mb-3 bg-muted/30'>
                        <h2 className='font-medium text-card-foreground'>{item.question}</h2>
                        <p className='text-sm text-primary'>{item?.type}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default QuestionListContainer
