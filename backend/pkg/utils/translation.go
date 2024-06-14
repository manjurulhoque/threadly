package utils

import (
	"fmt"
	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	enTranslations "github.com/go-playground/validator/v10/translations/en"
	"os"
	"reflect"
	"strconv"
	"strings"
)

type IError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

var (
	vl *validator.Validate
)

// TranslateError Translate errors
func TranslateError(model interface{}) (errs []IError) {
	english := en.New()
	uni := ut.New(english, english)
	trans, _ := uni.GetTranslator("en")

	vl = validator.New()
	_ = enTranslations.RegisterDefaultTranslations(vl, trans)

	_ = vl.RegisterTranslation("required", trans, func(ut ut.Translator) error {
		return ut.Add("required", "{0} is required", true) // see universal-translator for details
	}, func(ut ut.Translator, fe validator.FieldError) string {
		t, _ := ut.T("required", fe.Field())
		return t
	})

	_ = vl.RegisterTranslation("emailExists", trans, func(ut ut.Translator) error {
		return ut.Add("emailExists", "{0} is already exists", true)
	}, func(ut ut.Translator, fe validator.FieldError) string {
		t, _ := ut.T("emailExists", fe.Field())
		return t
	})

	_ = vl.RegisterTranslation("integer", trans, func(ut ut.Translator) error {
		return ut.Add("integer", "{0} must be an integer", true)
	}, func(ut ut.Translator, fe validator.FieldError) string {
		t, _ := ut.T("integer", fe.Field())
		return t
	})

	//if registerValidationError := vl.RegisterValidation("emailExists", func(fl validator.FieldLevel) bool {
	//	_, exists := handlers.FindUserByEmail(fl.Field().String())
	//	return !exists
	//}); registerValidationError != nil {
	//	fmt.Println("Error registering emailExists validation")
	//}

	if registerValidationError := vl.RegisterValidation("integer", func(fl validator.FieldLevel) bool {
		value, err := strconv.Atoi(fl.Field().String())
		if err != nil {
			// handle error
			fmt.Println(err)
			os.Exit(2)
		}
		return reflect.TypeOf(value).Kind() == reflect.Int
	}); registerValidationError != nil {
		fmt.Println("Error registering integer validation")
	}

	err := vl.Struct(model)

	if err == nil {
		return nil
	}

	for _, e := range err.(validator.ValidationErrors) {
		//translatedErr := fmt.Errorf(e.Translate(trans))
		translatedErr := IError{
			Field:   strings.ToLower(e.Field()),
			Message: e.Translate(trans),
		}
		errs = append(errs, translatedErr)
	}
	return errs
}
