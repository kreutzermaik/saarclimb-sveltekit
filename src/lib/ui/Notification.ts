import Swal from "sweetalert2";
import type { SweetAlertIcon } from "sweetalert2";

export default class Notification {

    public static REGISTERED_MESSAGE = 'Dein Account wurde erfolgreich erstellt!';
    public static LOGGED_IN_MESSAGE = 'Du bist nun eingeloggt!';
    public static REGISTER_ERROR_MESSAGE = 'Fehler beim Registrieren!';
    public static LOGIN_ERROR_MESSAGE = 'Fehler beim Login!';
    public static EVENT_ADDED_MESSAGE = 'Die Trainingseinheit wurde erfolgreich erstellt!';
    public static EVENT_ADDED_ERROR_MESSAGE = 'Die Trainingseinheit konnte nicht erstellt werden!';
    public static PLAN_UPDATED_MESSAGE = 'Der Wochenplan wurde erfolgreich aktualisiert!';
    public static PLAN_UPDATED_ERROR_MESSAGE = 'Der Wochenplan konnte nicht aktualisiert werden!';
    public static GYM_VALUES_ADDED_MESSAGE = 'Die Boulderhalle wurde erfolgreich angelegt!';

    static show(title: string, message?: string, type: SweetAlertIcon = 'success', duration?: number) {
        Swal.fire({
            icon: type,
            title: title,
            text: message,
            timer: (duration ? duration : 3000),
          })
    }
}