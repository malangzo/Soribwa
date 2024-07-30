import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

<link rel="manifest" href="/manifest.json" />

const REACT_APP_YUJUNG_FASTAPI = process.env.REACT_APP_YUJUNG_FASTAPI;

const KakaoMap = forwardRef((props, ref) => {
  const [markerData, setMarkerData] = useState([]);

  const fetchData = async (type = 'all') => {
      try {
          let url = '';
          switch (type) {
              case 'oneDay':
                  url = `${REACT_APP_YUJUNG_FASTAPI}/getNoiseDataOneDay`;
                  break;
              case 'week':
                  url = `${REACT_APP_YUJUNG_FASTAPI}/getNoiseDataWeek`;
                  break;
              default:
                  url = `${REACT_APP_YUJUNG_FASTAPI}/getNoiseData`;
          }

          const response = await fetch(url);
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setMarkerData(data); // 소음 데이터를 상태에 저장
      } catch (error) {
          console.error('Error fetching noise data:', error);
      }
  };

  useEffect(() => {
      fetchData('all'); // 초기에는 전체 데이터를 가져옴
  }, []);

  useImperativeHandle(ref, () => ({
    fetchData
  }));

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

          let currentOverlay = null;

          // 사용자의 현재 위치를 지도에 표시하는 함수
          if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function (position) {
              const lat = position.coords.latitude; // 위도
              const lon = position.coords.longitude; // 경도
              const locPosition = new kakao.maps.LatLng(lat, lon); // 사용자의 현재 위치 좌표

              map.panTo(locPosition);
              
              // 이전 오버레이가 있다면 제거
              if (currentOverlay) {
                currentOverlay.setMap(null);
              }

              var gps_content = '<div><img class="pulse" draggable="false" unselectable="on" src="https://ssl.pstatic.net/static/maps/m/pin_rd.png" alt="" style="width: 20px; height: 20px;"></div>';

              currentOverlay = new kakao.maps.CustomOverlay({
                  position: locPosition,
                  content: gps_content,
                  map: map
              });
              
              currentOverlay.setMap(map);        
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

            const infowindow = new kakao.maps.InfoWindow({
              content: message,
              removable: true,
            });

            infowindow.open(map, marker);
            map.setCenter(locPosition);
          }

          // 마커 이미지를 저장할 딕셔너리
          const Images = {
            dog_bark: 'https://github.com/malangzo/images/blob/3fcc31f09c9f0ac353744f3d62d21167f6cbccb7/dog_bark.png?raw=true',
            jackhammer: 'https://github.com/malangzo/images/blob/3fcc31f09c9f0ac353744f3d62d21167f6cbccb7/jackhammer.png?raw=true',
            drilling: 'https://github.com/malangzo/images/blob/3fcc31f09c9f0ac353744f3d62d21167f6cbccb7/drilling.png?raw=true',
            car_horn: 'https://github.com/malangzo/images/blob/3fcc31f09c9f0ac353744f3d62d21167f6cbccb7/car_horn.png?raw=true',
          };

          // 라벨명 딕셔너리
          const Labels = {
            dog_bark: '개 짖는 소음',
            jackhammer: '착암기 소음',
            drilling: '드릴 소음',
            car_horn: '차 경적 소음',
          };

          const handleMarkerData = () => {
            // 위치별로 데이터 그룹화
            const groupedData = markerData.reduce((acc, data) => {
              const key = `${data.location.lat},${data.location.lon}`;
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(data);
              return acc;
            }, {});

            Object.keys(groupedData).forEach((key) => {
              const group = groupedData[key];
              const centerLat = group[0].location.lat;
              const centerLon = group[0].location.lon;
              const locPosition = new kakao.maps.LatLng(centerLat, centerLon);

              // 라벨별로 가장 큰 데시벨 값 찾기
              const maxDecibelPerLabel = group.reduce((acc, data) => {
                if (!acc[data.label] || data.decibel > acc[data.label]) {
                  acc[data.label] = data.decibel;
                }
                return acc;
              }, {});

              // 전체 중 가장 큰 데시벨 값을 가진 데이터 찾기
              const maxDecibelData = Object.keys(maxDecibelPerLabel).reduce((max, label) => 
                maxDecibelPerLabel[label] > max.decibel ? {label, decibel: maxDecibelPerLabel[label]} : max,
                {label: '', decibel: -Infinity}
              );
              
              const newlabel = Labels[maxDecibelData.label] || maxDecibelData.label;
              const imageUrl = Images[maxDecibelData.label];
              const imageSize = new kakao.maps.Size(30, 40);

              const markerImage = new kakao.maps.MarkerImage(imageUrl, imageSize);

              const marker = new kakao.maps.Marker({
                position: locPosition,
                image: markerImage,
              });
              marker.setMap(map);

              const infowindowContent = `
                <div style="padding:15px;">
                  <strong>현 지점 소음의 최대 데시벨</strong><br></p>
                  ${Object.entries(maxDecibelPerLabel)
                    .sort(([,a], [,b]) => b - a)  // 데시벨 값으로 내림차순 정렬
                    .map(([label, decibel]) => `${Labels[label] || label}: ${decibel} dB`)
                    .join('<br>')}
                </div>
              `;

              const infowindow = new kakao.maps.InfoWindow({
                content: infowindowContent,
                removable: true,
              });

              kakao.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
              });

              // Decibel에 따라 원의 색상 및 반경 설정
              let circleOptions;
              if (maxDecibelData.decibel >= 100) {
                circleOptions = {
                  strokeColor: '#e33f36',
                  fillColor: '#f76860',
                  radius: 50,
                };
              } else if (maxDecibelData.decibel >= 80) {
                circleOptions = {
                  strokeColor: '#f77111',
                  fillColor: '#f79045',
                  radius: 20,
                };
              } else if (maxDecibelData.decibel >= 60) {
                circleOptions = {
                  strokeColor: '#fcdb1e',
                  fillColor: '#f5da40',
                  radius: 10,
                };
              }

              if (circleOptions) {
                const circle = new kakao.maps.Circle({
                  center: locPosition,
                  radius: circleOptions.radius,
                  strokeWeight: 0,
                  strokeColor: circleOptions.strokeColor,
                  strokeOpacity: 1,
                  strokeStyle: 'solid',
                  fillColor: circleOptions.fillColor,
                  fillOpacity: 0.5,
                });
                circle.setMap(map);

                // 애니메이션 적용 - 원 오퍼시티
                const minOpacity = 0.4; // 최소 오퍼시티
                const maxOpacity = 0.9; // 최대 오퍼시티
                const opacityStep = 0.007; // 오퍼시티 변화 속도
                let currentOpacity = 0.5; // 초기 오퍼시티 값
                let increasing = false; // 초기 애니메이션 상태 설정 (펼쳐짐)

                const animateCircleOpacity = () => {
                  if (increasing) {
                    currentOpacity += opacityStep;
                    if (currentOpacity >= maxOpacity) {
                      currentOpacity = maxOpacity;
                      increasing = false;
                    }
                  } else {
                    currentOpacity -= opacityStep;
                    if (currentOpacity <= minOpacity) {
                      currentOpacity = minOpacity;
                      increasing = true;
                    }
                  }

                  // 원의 fillOpacity 업데이트
                  circle.setOptions({
                    fillOpacity: currentOpacity,
                  });

                  // 다음 애니메이션 프레임 요청
                  requestAnimationFrame(animateCircleOpacity);
                };

                animateCircleOpacity(); // 애니메이션 시작
              }
            });
          };

          handleMarkerData();

          // 맵 크기가 변경될 때마다 relayout 호출
          const mapResizeObserver = new ResizeObserver(() => {
            map.relayout();
          });
          mapResizeObserver.observe(container);

          return () => {
            mapResizeObserver.disconnect();
          };
        });
      } else {
        console.error('Kakao object not loaded.');
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [markerData]);

  return <div id="map" style={{ width: '100%', height: '93%', position: 'fixed' }}></div>;
});

export default KakaoMap;
