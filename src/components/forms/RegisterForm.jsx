import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import api from "../../api/axios";

export default function RegisterForm() {

    const [form, setForm] = useState({
        nik:"",
        nama:"",
        instansi:"",
        jabatan:"",
        telp:"",
        password:"",
        password_confirmation:""
    });

    async function handleSubmit(e){

        e.preventDefault();

        try{

            await api.post(
                "/register",
                form
            );

            alert(
                "OTP berhasil dikirim ke WhatsApp"
            );

        }
        catch(err){

            console.log(
                err.response.data
            );

        }

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >

            <Input
                label="NIK"
                onChange={(e)=>
                    setForm({
                        ...form,
                        nik:e.target.value
                    })
                }
            />

            <Input
                label="Nama"
                onChange={(e)=>
                    setForm({
                        ...form,
                        nama:e.target.value
                    })
                }
            />

            <Input
                label="Instansi"
                onChange={(e)=>
                    setForm({
                        ...form,
                        instansi:e.target.value
                    })
                }
            />

            <Input
                label="Jabatan"
                onChange={(e)=>
                    setForm({
                        ...form,
                        jabatan:e.target.value
                    })
                }
            />

            <Input
                label="No HP"
                onChange={(e)=>
                    setForm({
                        ...form,
                        telp:e.target.value
                    })
                }
            />

            <Input
                label="Password"
                type="password"
                onChange={(e)=>
                    setForm({
                        ...form,
                        password:e.target.value
                    })
                }
            />

            <Input
                label="Konfirmasi Password"
                type="password"
                onChange={(e)=>
                    setForm({
                        ...form,
                        password_confirmation:e.target.value
                    })
                }
            />

            <Button>
                Register
            </Button>

        </form>

    );

}