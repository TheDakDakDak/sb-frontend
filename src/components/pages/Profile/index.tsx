import { useState, useEffect } from 'react';
import { Layout, Avatar, Row, Space, Col, Button } from "antd";
import { Content } from "antd/es/layout/layout";
import { UserOutlined, YoutubeFilled, AppleFilled, TwitterCircleFilled } from "@ant-design/icons";
import PlayBackBar from "../../PlaybackBar";
import DashRow from "../../DashRow";
import useGetBeats from '../../../hooks/useGetBeats';
import { Beat } from "../../../types";
import { cdnHostname } from "../../../config/routing";
import { getUserReq } from '../../../lib/axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getUserIdFromLocalStorage } from '../../../utils/localStorageParser';
import LoadingPage from '../Loading';
import Navbar from '../../Navbar';
import { User } from '../../../types/user';
import UserEditModal from '../../UserEditModal';

export default function Profile() {

  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trackPlaying, setTrackPlaying] = useState<Beat>();
  const [userId, setUserId] = useState<string>(searchParams.get('id') || '');
  const [userInfo, setUserInfo] = useState<User | null>();
  const [isCurrentUser, setCurrentUser] = useState<boolean>(userId === getUserIdFromLocalStorage());


  const { beats } = useGetBeats(userId);

  useEffect(() => {
    getUserReq(userId)
      .then((res) => { setUserInfo(res.data); })
      .then(() => { setIsLoading(false); })
      .catch((err) => { console.error(err) });
  }, [userId])

  return (
    isLoading || !userInfo ? 
    <LoadingPage /> :
    <Layout>
      <Navbar />
      <Content style={{ margin: '15px' }}>
        <Row style={{ margin: '5rem 5rem' }}>
          <Space direction="horizontal" >
            <Space direction='vertical' style={{ textAlign: 'center' }}>
              {isCurrentUser ? 
              <>
                <Avatar icon={ <UserOutlined /> } size={256}  />
                <UserEditModal user={userInfo} setUserInfo={setUserInfo}/>
              </>
              :
              <>
                <Avatar icon={ <UserOutlined /> } size={256}  />
                <Button type='ghost' style={{ border: 'solid', margin: '5px' }}>Follow</Button>
              </>
              }
            </Space>
            <Col style={{  margin: '0rem 5rem', textAlign: 'start' }} >
              <h1 style={{ fontSize: '5rem', margin: '0 1rem' }}>{userInfo.artistName}</h1>
              <p style={{ margin: '1rem', maxWidth: '60%' }}>
                {userInfo.bio}
              </p>
              <p style={{ margin: '1rem', maxWidth: '60%' }}>
                Member since {new Date(userInfo.created_at).toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"})}
              </p>
              <Space direction='horizontal' style={{  margin: '0rem 1rem', textAlign: 'start', justifyContent: 'center' }}>
                <YoutubeFilled 
                  style={{ fontSize: '1.5rem' }} 
                  onClick={() => { window.open(userInfo.linkedSocials.youtube ? userInfo.linkedSocials.youtube : `https://www.youtube.com/`) }} 
                />
                <TwitterCircleFilled 
                  style={{ fontSize: '1.5rem' }} 
                  onClick={() => { window.open(userInfo.linkedSocials.youtube ? userInfo.linkedSocials.twitter : `https://www.twitter.com/`) }} 
                />
                <AppleFilled style={{ fontSize: '1.5rem' }} />
              </Space>
            </Col>
          </Space>
        </Row>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          { beats ? beats.map((beat) => {
            return <DashRow beat={beat}  onClick={()=>{setTrackPlaying(beat)}} editable={isCurrentUser} />;
          }): <h3>This user hasn't uploaded any beats yet.</h3>}
        </div>
      </Content>
      <PlayBackBar 
          trackTitle={trackPlaying ? trackPlaying.title: ''} 
          trackArtist={trackPlaying ? trackPlaying.artistName: ''} 
          trackSrcUrl={trackPlaying ? `${cdnHostname}/${trackPlaying.audioKey}`: ''}
          isShown={trackPlaying !== undefined}
        />
    </Layout> 
    
  )
}