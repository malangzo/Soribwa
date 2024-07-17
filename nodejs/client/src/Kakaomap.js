import React, { useEffect, useState } from 'react';

const KakaoMap = () => {
  const [markerData, setMarkerData] = useState([]);

  useEffect(() => {
    // 소음 데이터를 가져오는 함수
    const fetchData = async () => {
      try {
        const response = await fetch('http://43.202.99.19:5200/getNoiseData');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMarkerData(data); // 소음 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching noise data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      const { kakao } = window;
      if (kakao) {
        kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center: new kakao.maps.LatLng(37.494598, 127.027558), // 초기 중심점
            level: 3,
          };
          const map = new kakao.maps.Map(container, options);

          // 사용자의 현재 위치를 지도에 표시하는 함수
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
              const lat = position.coords.latitude; // 위도
              const lon = position.coords.longitude; // 경도
              const locPosition = new kakao.maps.LatLng(lat, lon); // 사용자의 현재 위치 좌표

              const message = '<div style="padding:5px;">현재 위치</div>'; // 인포윈도우에 표시될 내용
              displayMarker(locPosition, message); // 마커와 인포윈도우를 표시
            });
          } else {
            const locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
            const message = 'GPS를 사용할수 없어요..';
            displayMarker(locPosition, message);
          }

          // 지도에 마커와 인포윈도우를 표시하는 함수
          function displayMarker(locPosition, message) {
            const marker = new kakao.maps.Marker({
              map: map,
              position: locPosition,
            });

            const iwContent = message;
            const iwRemoveable = true;

            const infowindow = new kakao.maps.InfoWindow({
              content: iwContent,
              removable: iwRemoveable,
            });

            infowindow.open(map, marker);
            map.setCenter(locPosition);
          }

          // 마커 이미지를 저장할 딕셔너리
          const Images = {
            dog_bark: 'https://raw.githubusercontent.com/malangzo/images/86bc2572f08e878b447e0325915e7ee0d0643bea/dog_bark.svg',
            construction_noise: 'https://raw.githubusercontent.com/malangzo/images/86bc2572f08e878b447e0325915e7ee0d0643bea/construct.svg',
            drill_noise: 'https://raw.githubusercontent.com/malangzo/images/86bc2572f08e878b447e0325915e7ee0d0643bea/drill.svg',
            car_horn: 'https://raw.githubusercontent.com/malangzo/images/86bc2572f08e878b447e0325915e7ee0d0643bea/car_horn.svg',
          };

          // 마커 생성 및 표시
          markerData.forEach((data) => {
            const imageUrl = Images[data.label]; // 해당 라벨에 맞는 이미지 URL 가져오기
            const imageSize = new kakao.maps.Size(30, 40); // 마커이미지의 크기

            const markerImage = new kakao.maps.MarkerImage(imageUrl, imageSize);

            const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(data.location.lat, data.location.lon),
              image: markerImage, // 마커에 이미지 적용
            });
            marker.setMap(map);

            // 인포윈도우 생성 (옵션)
            const infowindow = new kakao.maps.InfoWindow({
              content: `<div style="padding:5px;">${data.label}<br>Decibel: ${data.decibel}</div>`,
              removable: true,
            });

            // 마커 클릭 시 인포윈도우 표시
            kakao.maps.event.addListener(marker, 'click', function () {
              infowindow.open(map, marker);
            });

            // Decibel에 따라 원의 색상 및 반경 설정
            let circleOptions;
            if (data.decibel >= 100) {
              circleOptions = {
                strokeColor: '#e33f36',
                fillColor: '#f76860',
                radius: 60,
              };
            } else if (data.decibel >= 80) {
              circleOptions = {
                strokeColor: '#f77111',
                fillColor: '#f79045',
                radius: 20,
              };
            } else if (data.decibel >= 60) {
              circleOptions = {
                strokeColor: '#fcdb1e',
                fillColor: '#f5da40',
                radius: 10,
              };
            }

            // circleOptions가 설정된 경우에만 원을 생성 및 지도에 표시
            if (circleOptions) {
              const circle = new kakao.maps.Circle({
                center: new kakao.maps.LatLng(data.location.lat, data.location.lon),
                radius: circleOptions.radius,
                strokeWeight: 0,
                strokeColor: circleOptions.strokeColor,
                strokeOpacity: 1,
                strokeStyle: 'solid',
                fillColor: circleOptions.fillColor,
                fillOpacity: 0.5,
              });

              circle.setMap(map);
            }
          });
        });
      } else {
        console.error('Kakao object not loaded.');
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [markerData]);

  return <div id="map" style={{ width: '100%', height: '93%' }}></div>;
};

export default KakaoMap;
