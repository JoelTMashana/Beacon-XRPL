"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Beacon from '@/components/custom/beacons';

const Beacons = () => {
  const [beacons, setBeacons] = useState([]);

  useEffect(() => {
    const fetchBeacons = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/beacons/all');
        setBeacons(response.data.beacons);
      } catch (error) {
        console.error('Error fetching beacons:', error);
      }
    };

    fetchBeacons();
  }, []);

  return (
    <div>
      <h1>Beacons</h1>
      <div className="flex flex-wrap">
        {beacons.map(beacon => (
          <Beacon key={beacon.beacon_id} beacon={beacon} />
        ))}
      </div>
    </div>
  );
};

export default Beacons;
