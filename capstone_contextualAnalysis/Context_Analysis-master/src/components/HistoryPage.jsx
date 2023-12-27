import {useEffect, useState} from "react";

export const HistoryPage = () => {
    const [history, setHistory] = useState([{
        heading: "Topic:Damage, Destruction",
        timing: "3 days ago",
        desc: "  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum, quo, rerum! Aliquam aspernatur\n" +
            "                        assumenda consectetur dolorem eligendi eum facilis harum in inventore ipsum labore minima molestiae\n" +
            "                        necessitatibus nemo, numquam officiis praesentium quasi repellendus saepe sed sequi tempore totam ut\n" +
            "                        velit veritatis vero vitae voluptatem? Consequatur culpa, praesentium? At dolor, in nostrum quas\n" +
            "                        quidem repellendus tenetur unde.\n" +
            "                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor laboriosam neque voluptatibus?\n" +
            "                  "
    },{
        heading: "Topic:Damage, Destruction",
        timing: "3 days ago",
        desc: "  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum, quo, rerum! Aliquam aspernatur\n" +
            "                        assumenda consectetur dolorem eligendi eum facilis harum in inventore ipsum labore minima molestiae\n" +
            "                        necessitatibus nemo, numquam officiis praesentium quasi repellendus saepe sed sequi tempore totam ut\n" +
            "                        velit veritatis vero vitae voluptatem? Consequatur culpa, praesentium? At dolor, in nostrum quas\n" +
            "                        quidem repellendus tenetur unde.\n" +
            "                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor laboriosam neque voluptatibus?\n" +
            "                  "
    },
    ]);

    function fetchHistory() {
        fetch("http://localhost:5000/history")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    setHistory(result);
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    useEffect(() => {
        fetchHistory();
    },[])

    return (
        <div className={"history"}>
            <div className="heading">
                History-Recent Searches
            </div>
            <div className="history_container">
                {
                    history.map((value, index, array) => <div className="history_card">
                            <div className="card_heading">
                                {value.heading}
                                <span className={"timing"}>
                                    {
                                        value.timing
                                    }
                    </span>
                            </div>
                            <div className="card_sub_heading">
                                {
                                    value.desc
                                }
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    );
}