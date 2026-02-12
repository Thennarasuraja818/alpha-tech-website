import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Sample course data
const courses = [
  {
    title: "React Basics",
    date: "2025-04-20",
    time: "10:00 AM",
    instructor: "John Doe",
  },
  {
    title: "Advanced JavaScript",
    date: "2025-04-22",
    time: "2:00 PM",
    instructor: "Jane Smith",
  },
];

const CourseCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [courseDetails, setCourseDetails] = useState(null);

  // Check if a course exists for a specific date
  const getCourseForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    return courses.filter(course => course.date === dateString);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const courseOnDate = getCourseForDate(date);
    setCourseDetails(courseOnDate);
  };

  return (
    <section className="podcost-transforms-section ">
    <div className='container-fluid'>
    <div className='clk' style={{ height: '100vh', padding: '20px', marginTop: '100px' }}>
      <h3>Course Calendar</h3>
      <Calendar onChange={handleDateChange} value={selectedDate} />

      <div>
        {courseDetails && courseDetails.length > 0 ? (
          <div>
            <h4>Courses on {selectedDate.toDateString()}:</h4>
            {courseDetails.map((course, index) => (
              <div key={index}>
                <h5>{course.title}</h5>
                <p>Time: {course.time}</p>
                <p>Instructor: {course.instructor}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No courses on this date.</p>
        )}
      </div>
    </div>
    </div>
    </section>
  );
};

export default CourseCalendar;
