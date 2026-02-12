import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, dateFnsLocalizer } from 'react-big-calendar';
import { parseISO } from 'date-fns';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import apiProvider from '../../apiProvider/api';
import { parse, formatISO } from 'date-fns';
import { format } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { useSelector, useDispatch } from 'react-redux';
import { handleForm } from "../../redux/trainingForm";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { useTranslation } from "../../context/TranslationContext";



const locales = { 'en-US': enUS };
// const localizer = dateFnsLocalizer({ format, parse, locales, startOfWeek: () => 0, getDay: date => date.getDay() });

const localizer = momentLocalizer(moment);

// Set default date to the next upcoming event

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const disPatch = useDispatch();
  const navigate = useNavigate();
  const { translateSync, currentLanguage, setCurrentLanguage } = useTranslation();


  const getDefaultDate = () => {
    const now = new Date();
    const upcoming = events.find((event) => event.start > now);
    return upcoming ? upcoming.start : now;
  };


  const handleSelectEvent = (event) => {
    console.log('Event clicked:', event);
    disPatch(handleForm({ isGetList: true, id: event.courseId }));
    // console.log(id, "id-ttttttt");
    navigate(`/training-detail/${event.courseId}`);
  };

  const handleSelectSlot = (slotInfo) => {
    console.log('Empty slot clicked:', slotInfo);
  };

  const CustomAgendaEvent = ({ event }) => {
    const parts = event.title.split(/(\w+\s\d{1,2}.*)$/); // Split before the date part
    const courseTitle = parts[0]?.trim();
    const datePart = parts[1]?.trim();

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span>{courseTitle}</span>
        <span style={{ whiteSpace: 'nowrap' }}>{datePart}</span>
      </div>
    );
  };


  const fetchData = async () => {
    try {

      const today = new Date();
      const todayFormatted = format(today, 'dd-MM-yyyy');
      const result = await apiProvider.getCourseCalender(todayFormatted);

      if (result && result.response && result.response.data && result.response.data.data) {
        const rawData = result.response.data.data;
        console.log(rawData, "rawData");

        const newEvents = rawData.flatMap(course => {
          if (!course.courseDate || !Array.isArray(course.courseDate)) return [];

          return course.courseDate.map(dateObj => {
            if (!dateObj.date) return null;

            try {
              // Parse the date string with proper validation
              const startDate = parse(dateObj.date, 'dd-MM-yyyy', new Date());

              // Validate the parsed date
              if (isNaN(startDate.getTime())) {
                console.warn(`Invalid date: ${dateObj.date}`);
                return null;
              }

              const endDate = new Date(startDate);
              endDate.setDate(startDate.getDate() + 2);

              const title = `${course.courseName} ${course.categoryType === 'Online' ? '(Online)' : '(Class room)'}`;
              const startDateStr = format(startDate, 'MMMM d');
              const endDateStr = format(endDate, 'MMMM d');
              console.log(startDateStr, "startDateStrstartDateStr");

              return {
                title: `${title} ${startDateStr} - ${endDateStr}`,
                start: formatISO(startDate),
                end: formatISO(startDate), // Only show on start date
                allDay: true,
                courseId: course.id
              };
            } catch (error) {
              console.error(`Error processing date ${dateObj.date}:`, error);
              return null;
            }
          }).filter(event => event !== null); // Remove any null entries
        });

        console.log("Formatted events:", newEvents);
        setEvents(newEvents);
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  console.log(events, "eventsevents");


  return (

    <>


      <Helmet>
        <title>Web design training courses in dubai | iLap</title>
        <meta
          name="keywords"
          content="senior management training, business analyst course, facility management courses in dubai, corporate training companies in uae, strategic management course, leadership training courses for managers, training courses"
        />

      </Helmet>

      <div>


        <section className="podcost-transforms-section">
          <div className="container">
            <div style={{ height: '100vh', padding: '20px', marginTop: '100px', paddingBottom: "80px" }}>
              <h2>{translateSync('Course Calendar')}</h2>

              <Calendar
                localizer={localizer}
                events={events}
                defaultView="agenda"
                views={['week', 'agenda', 'month']}
                selectable
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                // style={{ height: '80vh' }}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                components={{
                  agenda: {
                    event: CustomAgendaEvent,
                  },
                }}
                formats={{
                  agendaDateFormat: 'D MMM YYYY', // moment format
                  dayHeaderFormat: 'D MMM YYYY',  // moment format
                }}
                eventPropGetter={(event) => ({
                  style: {
                    cursor: 'pointer',
                    // Optional styling:
                    color: '#333',
                  }
                })}
              />




            </div>
          </div>
        </section>


      </div>
    </>
  );
};

export default CalendarPage;
