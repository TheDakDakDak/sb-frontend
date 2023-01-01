import { Modal, Button, Input, Form, Select } from 'antd';
import { useState } from 'react';
import { Beat } from '../../types/beat';
import { genreOptions } from '../../utils/genreTags';
import { SelectProps } from '@chakra-ui/react';

interface IEditBeatModalProps {
  beat: Beat
}

export default function BeatEditModal(props: IEditBeatModalProps) {
  const { beat } = props;
  console.log(beat);
  const currentGenreTags = beat.genreTags.map((val) => ({label: val, value: val}));
  console.log(currentGenreTags)

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(beat.title);
  const [artwork, setArtwork] = useState<File | Blob>();    // NOTE: if this is empty, the artowrk will be uneffected
  const [genreTags, setGenreTags] = useState(currentGenreTags);

  const handleCancel = () => {
    setIsOpen(false);
  }

  const handleGenreTagsChange = (val: any) => {
    setGenreTags(val);
  }

  return (
    <>
    <Button type='ghost' onClick={() => {setIsOpen(true)}}>Edit</Button>
    <Modal 
      open={isOpen}
      onCancel={handleCancel} 
      footer={[ 
        <Button key='cancel' onClick={handleCancel} >Cancel</Button>,
        <Button key='save' type='primary' >Save Changes</Button>
      ]}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item label='Title' name='title'>
          <Input defaultValue={title} />
        </Form.Item>
        <Form.Item label='Description' name='description'>
          <Input defaultValue={beat.description as string} />
        </Form.Item>
        <Form.Item label='Genres' name='genres'>
        <Select 
          placeholder="Genre Tags"
          options={genreOptions}
          defaultValue={genreTags}
          mode='multiple'
          maxTagCount='responsive'
          onChange={handleGenreTagsChange}
        />
        </Form.Item>
        <Form.Item label='Tempo' name='tempo'>
          <Input defaultValue={beat.tempo} addonAfter='BPM'/>
        </Form.Item>
        <Form.Item label='Key' name='key'>
          <Input defaultValue={beat.key} />
        </Form.Item>
      </Form>
    </Modal>
    </>
  )
}