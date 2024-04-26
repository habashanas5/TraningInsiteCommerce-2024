import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import { Props } from "@insite/shell/Components/Elements/RichTextEditorCode";
import * as React from "react";
import { css } from "styled-components";

export default class RichTextEditor extends React.Component<Props> {
    state = {
        RichTextEditorCode: null,
    };

    componentDidMount() {
        import(/* webpackChunkName: "richText" */ "@insite/shell/Components/Elements/RichTextEditorCode").then(
            ({ default: RichTextEditorCode }) => {
                this.setState({
                    RichTextEditorCode,
                });
            },
        );
    }

    render() {
        const RichTextEditorCode: any = this.state.RichTextEditorCode;
        return (
            <>
                {!RichTextEditorCode ? (
                    <LoadingSpinner
                        css={css`
                            margin: 20px auto;
                            display: block;
                        `}
                    />
                ) : (
                    <RichTextEditorCode {...this.props} />
                )}
            </>
        );
    }
}
