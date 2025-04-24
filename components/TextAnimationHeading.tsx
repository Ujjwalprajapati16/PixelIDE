'use client';

import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { cn } from '@/lib/utils';

type TextAnimationHeadingProps = {
    className?: string;
    classNameAnimationContainer?: string;
};

export const TextAnimationHeading: React.FC<TextAnimationHeadingProps> = ({
    className,
    classNameAnimationContainer,
}) => {
    return (
        <div
            className={cn(
                'mx-auto text-2xl lg:text-5xl my-6 flex flex-col gap-3 lg:gap-5 font-bold text-center',
                className
            )}
        >
            <div className={cn('text-primary drop-shadow-md', classNameAnimationContainer)}>
                Build Space
            </div>

            <div className="w-fit text-center mx-auto">
                <TypeAnimation
                    sequence={['Your team', 1000, 'Your Ideas', 1000, 'One Editor', 1000]}
                    wrapper="span"
                    speed={50}
                    style={{ fontSize: '2em', display: 'inline-block' }}
                    repeat={Infinity}
                />
            </div>
        </div>
    );
};
