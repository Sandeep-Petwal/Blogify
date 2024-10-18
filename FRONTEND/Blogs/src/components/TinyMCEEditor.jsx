import { Editor } from '@tinymce/tinymce-react';

const TinyMCEEditor = ({ onEditorChange, value }) => {
    return (
        <Editor
            apiKey='5e6mml8ohiiwfofj2a0ayrak2okhjh6i96mhfa4a881426jh'
            // initialValue={value}
            init={{
                height: 300,
                directionality: 'ltr',
                skin: 'oxide-dark',
                content_css: 'dark',
                menubar: true,
                plugins: [
                    "image",
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                    "anchor",
                ],
                toolbar:
                    "undo redo | blocks | image |clearformat | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
                content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",

            }}
            onEditorChange={onEditorChange}
        />
    );
};

export default TinyMCEEditor;
