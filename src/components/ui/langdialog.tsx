import { supportedLanguages } from "@/utils/constants";
import { Button } from "./interactive";
import { useAtom } from "jotai";
import { storageAtom } from "@/store";

interface LangDialogProps {
    onClose: () => void;
    open: boolean;
    onSubmit: (selectedLanguage: string) => void;
}

const LangDialog: React.FC<LangDialogProps> = ({ onClose, open, onSubmit }) => {
    const [storage, setStorage] = useAtom(storageAtom);
    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStorage({ ...storage, language: event.target.value });
    };

    return (
        <div className={ `fixed z-10 inset-0 overflow-y-auto ${open ? 'block' : 'hidden'}` }>
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="information"><path d="M12,10a1,1,0,0,0-1,1v6a1,1,0,0,0,2,0V11A1,1,0,0,0,12,10Zm0-4a1.25,1.25,0,1,0,1.25,1.25A1.25,1.25,0,0,0,12,6Z"></path></svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Select conversation language</h3>
                                <div className="mt-2">
                                    <p className="text-sm leading-5 text-gray-500"> Select the language you want to use for this conversation.</p>
                                </div>
                                <div className="mt-2 flex flex-col">
                                    <div className="mt-1 relative">
                                        <select id="language" name="language"
                                            value={ storage?.language || "en" }
                                            onChange={ handleLanguageChange }
                                            className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                                            { supportedLanguages.map((language) => (
                                                <option key={ language.value } value={ language.value }>
                                                    { language.label }
                                                </option>
                                            )) }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                            <Button
                                onClick={ () => { onSubmit(storage.language || "en") } }
                            >
                                Submit
                            </Button>
                        </span>
                        <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                            <Button
                                variant="secondary"
                                onClick={ onClose }
                            >
                                Close
                            </Button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LangDialog;