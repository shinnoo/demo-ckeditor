import React, { Component, useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Row, Col, Button, Space } from 'antd';

const News = () => {
    const [top, setTop] = useState(10);
    const [bottom, setBottom] = useState(10);
    const [content , setContents] = useState();
    const [isDisabled , setIsDisabled] = useState(true);
    return (
        <div className="App">
            <div style={{ display: 'flex' }}>
                <Space style={{ marginLeft: 'auto', paddingBottom: '10px' }}>
                    <Button type="primary" disabled={isDisabled} onClick={() => {
                        console.log(content);
                    }}>
                        Save
                    </Button>
                    <Button danger type="primary" >
                        Cancel
                    </Button>
                </Space>

            </div>

            <CKEditor
                editor={ClassicEditor}
                data="<p>Hello from CKEditor 5!</p>"
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setContents(data);
                    setIsDisabled(false);
                }}
                onBlur={(event, editor) => {
                    console.log('Blur.');
                }}
                onFocus={(event, editor) => {
                    console.log('Focus.');
                }}
            />
        </div>
    );
}

export default News;