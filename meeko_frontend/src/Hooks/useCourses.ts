import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Course {
    course_name: string;
    course_image: string;
    course_description: string;
}

export interface CoursesResponse {
    data: Course[];
}

const fetchCourses = async () => {
    const response = await axios.get('http://localhost:3000/users/getcourses');
    return response.data.data;
}

export const useCourses =()=>{
    return useQuery({   
        queryKey:['courses'],
        queryFn: fetchCourses,
        staleTime : 1000 * 60 * 5
    })
}

