import type { ReactElement } from "react";

type InputTextProps = {
    id: string;
}

export default function InputText({id}: InputTextProps): ReactElement {
    return (
        <div>
            <input id={id}
                   name="name"
                   type="text"
                   required
                   minLength={2}
                   placeholder="John Doe"
                   className="apex-input"
            />
        </div>
    )
}
