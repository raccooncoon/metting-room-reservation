import CalenderApp from "./components/CalenderApp.jsx";
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { listReservations } from "./graphql/queries";
import dayjs from "dayjs";

const client = generateClient();

function App() {
  const [allReservations, setAllReservations] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // List all items
        const { data } = await client.graphql({
          query: listReservations
        });
        const allReservationsData = data.listReservations.items.map((item) => {
          return {
            id: item.id,
            title: item.meetingContent,
            start: dayjs(item.startStr).format(),
            end: dayjs(item.endStr).format(),
            allDay: false,
            extendedProps: {
              attendees: item.attendees,
            },
          };
        });
        console.log("allReservationsData =>> ", allReservationsData);
        // 상태 업데이트
        setAllReservations(allReservationsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // 두 번째 인자로 빈 배열을 전달하여 한 번만 실행되도록 설정

  // 데이터를 가져온 후에 CalenderApp 컴포넌트 렌더링
  return allReservations && <CalenderApp initReservations={allReservations} />;
}

export default App;
