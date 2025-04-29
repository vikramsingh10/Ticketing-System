import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";
import "../styles/Analytics.css";

const chatData = [
  { week: "Week 1", chats: 12 },
  { week: "Week 2", chats: 10 },
  { week: "Week 3", chats: 14 },
  { week: "Week 4", chats: 11 },
  { week: "Week 5", chats: 13 },
  { week: "Week 6", chats: 7 },
  { week: "Week 7", chats: 9 },
  { week: "Week 8", chats: 15 },
  { week: "Week 9", chats: 17 },
  { week: "Week 10", chats: 19 },
];

const Analytics = () => {
  return (
    <div className="analytics-container">
      <h2 style={{ color: "#6A6B70" }}>Analytics</h2>

      <div className="section">
        <h3 className="section-title">Missed Chats</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chatData}
            margin={{ top: 20, right: 30, bottom: 5 }}>
            <XAxis dataKey="week" interval={0} />
            <YAxis /> 
            <Tooltip />
            <Line
              type="monotone"
              dataKey="chats"
              stroke="#00c853"
              strokeWidth={3}
              dot={{ fill: "#fff", stroke: "#00c853", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="stats">
        <div className="stat-card">
          <h3>Average Reply time</h3>
          <div className="average">
            <p className="stat-description">
              For highest customer satisfaction rates you should aim to reply to
              an incoming customer's message in 15 seconds or less. Quick
              responses will get you more conversations, help you earn customers
              trust and make more sales.
            </p>
            <p className="stat-value green">0 secs</p>
          </div>
        </div>

        <div className="stat-card">
          <h3>Resolved Tickets</h3>
          <div className="resolved">
            <p className="stat-description">
              A callback system on a website, as well as proactive invitations,
              help to attract even more customers. A separate round button for
              ordering a call with a small animation helps to motivate more
              customers to make calls.
            </p>
            <div className="circle-progress">
              <svg viewBox="0 0 36 36" className="circular-chart green">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray="80, 100"
                  d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">
                  80%
                </text>
              </svg>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <h4>Total Chats</h4>
          <div className="total">
            <p className="stat-description">
              This metric Shows the total number of chats for all Channels for
              the selected the selected period
            </p>
            <p className="stat-value green">122 Chats</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
