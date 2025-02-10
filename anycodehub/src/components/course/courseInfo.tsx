import React from 'react'
import { CourseInfoProps } from '../../types'

const CourseInfo = (props: CourseInfoProps) => {
    return (
        <div className="c-info flex items-center gap-1">
            <div className="c-tooltip dark:text-grayDark">
                {props.tooltipName}
            </div>
            {props.courseInfoIcon ? props.courseInfoIcon : ''}
            <span className="text-sm  text-gray-500 dark:text-grayDark">{props.tooltipContent}</span>
        </div>
    )
}

export default CourseInfo